export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  let cookieName;

  // Set the cookie name based on the user's role
  if (user.role === "Admin") {
      cookieName = "adminToken";
  } else if (user.role === "Bác sĩ") {
      cookieName = "doctorToken";
  } else {
      cookieName = "patientToken";
  }

  res
  .status(statusCode)
  .cookie(cookieName, token, {
      expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
  })
  .json({
      success: true,
      message,
      user,
      token,
  });
};
