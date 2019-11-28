import { AuthenticationError } from "apollo-server-core";
import { User } from "./models";
import "dotenv/config";

export const attemptsSignIn = async (email, password) => {
  const message = "Incorrect email or password. Please, try again.";

  try {
    const user = await User.findOne({ email });
    if (!user) throw new AuthenticationError(message);

    if (!(await user.matchesPassword(password)))
      throw new AuthenticationError(message);

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const signedId = req => req.session.userId;

export const ensureSignedIn = req => {
  if (!signedId(req)) throw new AuthenticationError("You must be signed in");
};

export const ensureSignedOut = req => {
  if (signedId(req)) throw new AuthenticationError("You are already signed in");
};

export const signOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
      if (err) reject(err);
      res.clearCookie(process.env.SESSION_NAME);
      resolve(true);
    });
  });
