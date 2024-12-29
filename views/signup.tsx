import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SIGNUP } from "@/graphql/mutation";
import { GET_USERS } from "@/graphql/query";
import { useAppStore } from "@/store/store";
import { User } from "@/types/user";
import { useMutation } from "@apollo/client";
import { Field, Form, Formik } from "formik";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";

type Props = {
  setAuthType: (val: string) => void;
};

const Signup = ({ setAuthType }: Props) => {
  const { setAuthenticated, setUser } = useAppStore((state) => state);
  const router = useRouter();
  const [signUp] = useMutation(SIGNUP, { refetchQueries: [{ query: GET_USERS }], awaitRefetchQueries: true });

  const onSignup = async (values: User) => {
    try {
      await signUp({ variables: values });
      setAuthenticated(true);
      setUser(values.id);
      localStorage.setItem("auth", JSON.stringify(values));
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  const initialValues: User = {
    id: nanoid(),
    name: "",
    email: "",
    password: "",
    avatar: "",
    location: "",
    following: [],
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSignup}>
      <Form className="lg:max-w-md w-full">
        <h3 className="text-gray-800 text-3xl font-extrabold mb-12">Registration</h3>
        <div className="space-y-6">
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Name</label>
            <Field as={Input} name="name" type="text" placeholder="Enter name" />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Email</label>
            <Field as={Input} name="email" type="text" placeholder="Enter email" />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Password</label>
            <Field as={Input} name="password" type="password" placeholder="Enter password" />
          </div>
          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 border-gray-300 rounded" />
            <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
              I accept the <a className="text-blue-600 font-semibold hover:underline ml-1">Terms and Conditions</a>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </div>
        <p className="text-sm text-gray-800 mt-6">
          Already have an account?{" "}
          <span onClick={() => setAuthType("login")} className="text-blue-600 font-semibold hover:underline ml-1 cursor-pointer">
            Login here
          </span>
        </p>
      </Form>
    </Formik>
  );
};

export default Signup;
