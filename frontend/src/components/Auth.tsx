import { SignupInput } from "medium-comomn-ab";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_Url } from "../config";
export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
  });

  async function sendRequest() {
    try{
        const response = await axios.post(`${BACKEND_Url}/api/v1/user/${type==="signup"?"signup":"signin"}`,postInputs);
        const jwt =response.data;
        localStorage.setItem("token",jwt);
        navigate("/blogs");
    }catch(e){

        console.log(e)
    }
    
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
        <div className="px-10">
          <div className="text-3xl font-extrabold">Create an account</div>
          <div className="text-slate-400">
           {type === "signin"? "Don't have an account": "Already have an account?"}
            <Link className="pl-2 underline" to={type=== "signin" ? "/signup" : "/signin"}>
              {type === "signin" ? "sign up" : "sign in"}
            </Link>
          </div>
        </div>
        <div className="pt-4">
        {type === "signup" ? <LablledInput
          label="Name"
          placeholder="Abhiiiii"
          onChange={(e) => {
            setPostInputs({
              ...postInputs,
              name: e.target.value,
            });
          }}
        /> : null}

        <LablledInput
          label="Username"
          placeholder="Abhiiiii@gmail.com"
          onChange={(e) => {
            setPostInputs({
              ...postInputs,
              email: e.target.value,
            });
          }}
        />

        <LablledInput
          label="Password"
          type={"password"}
          placeholder="123456"
          onChange={(e) => {
            setPostInputs({
              ...postInputs,
              password: e.target.value,
            });
          }}
        />
        <button onClick={sendRequest} type="button" className="text-white w-full mt-4 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type == "signup" ? "sign up" : "sign in"}</button>

        </div>
        </div>
      </div>
    </div>
  );
};

interface LablledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LablledInput({
  label,
  placeholder,
  onChange,
  type,
}: LablledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white pt-4">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
