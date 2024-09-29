import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async (userId) => {
  try {
      const user = await User.findById(userId);
      const accessToken = await user.generateAccessToken();
      const refreshToken = await user.generateRefreshToken();
      
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
      
      return { accessToken, refreshToken };
  } catch (error) {
      console.error(error); // Log the error for debugging
      throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};


const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are Required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already existed ");
  }

  const avatarlocalPath = req.file?.path;


  if (avatarlocalPath === "") {
    throw new ApiError(400, "Avatar file Path Required");
  }

  const avatar = await uploadOnCloudinary(avatarlocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file not uploaded to cloudinary");
  }

  //   console.log(avatar);

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
  
    if (!email && !username) {
      throw new ApiError(400, "username or email is required");
    }
  
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
  
    if (!user) {
      throw new ApiError(404, "User does not exists");
    }
  
    const isPasswordValid = await user.isPasswordCorrect(password);
  
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }
  
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );
  
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in Succesfully"
        )
      );
  });

export { registerUser, loginUser };
