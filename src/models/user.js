import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      validate: {
        validator: email => User.doesntExist({ email }),
        message: ({ value }) => `Email ${value} has already been taken.` // TODO security
      }
    },
    username: {
      type: String,
      required: true,
      validate: {
        validator: username => User.doesntExist({ username }),
        message: ({ value }) => `Username ${value} has already been taken.` // TODO security
      }
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    autoIndex: false
  }
);

UserSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcryptjs.hash(this.password, 10);
    } catch (err) {
      next(err);
      console.error(err);
    }
  }

  next();
});

UserSchema.static("doesntExist", async function(options) {
  return (await this.where(options).countDocuments()) === 0;
});

UserSchema.methods = {
  matchesPassword(password) {
    return bcryptjs.compare(password, this.password);
  }
};

const User = model("User", UserSchema);

export default User;
