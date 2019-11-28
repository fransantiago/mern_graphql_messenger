import { UserInputError } from "apollo-server-core";
import mongoose from "mongoose";
import { signUp, signIn } from "../schemas";
import { User } from "../models";
import { attemptsSignIn, signOut } from "../auth";

export default {
  Query: {
    me: (root, args, { req }, info) => {
      // TODO projection
      return User.findById(req.session.userId);
    },
    users: (root, args, { req }, info) => {
      // TODO projection, pagination
      return User.find({});
    },
    user: (root, { id }, { req }, info) => {
      // TODO projection, sanitization
      if (!mongoose.Types.ObjectId.isValid(id))
        throw new UserInputError(`${id} is not a valid user id.`);

      return User.findById(id);
    }
  },
  Mutation: {
    signUp: async (root, args, { req }, info) => {
      // TODO not auth
      try {
        await signUp.validate(args, { abortEarly: false });

        const user = await User.create(args);
        req.session.userId = user.id;

        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
    signIn: async (root, args, { req }, info) => {
      try {
        await signIn.validate(args, { abortEarly: false });

        const user = await attemptsSignIn(args.email, args.password);

        req.session.userId = user.id;

        return user;
      } catch (err) {
        throw new Error(err);
      }
    },
    signOut: async (root, args, { req, res }, info) => {
      return signOut(req, res);
    }
  }
};
