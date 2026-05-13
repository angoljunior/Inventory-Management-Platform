import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from '../api/axios'
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await axios.post("login/", {
        email,
        password,
      })

      if (response.data && response.data.access) {
        localStorage.setItem("token", response.data.access)
        localStorage.setItem("email", response.data.email)
        localStorage.setItem("refresh", response.data.refresh)
        localStorage.setItem("isSuperUser", response.data.isSuperUser)
        localStorage.setItem("userName", response.data.name)
        localStorage.setItem("userId", response.data.userId) ///name using getItem that of the one in the backend response, not the one in the local storage, which is userId, not id
      }

      toast.success("Login Successful! ✅")
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.")
      toast.error(err.response?.data?.detail || "Login failed.")
    }
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-background"
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
          />
        </Field>

        <Field>
          <Button type="submit">Login</Button>
        </Field>

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button">
            Login with GitHub
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link to="/auth" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}