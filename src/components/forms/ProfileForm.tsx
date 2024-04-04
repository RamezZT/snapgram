"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EditPostValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { Loader } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useUpdateUser } from "@/lib/react-query/queriesAndMutations";
import { useNavigate } from "react-router-dom";
const ProfileForm = () => {
  const { user, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();
  const { mutateAsync: updateUser, isPending: isUserUpdating } =
    useUpdateUser();

  const form = useForm<z.infer<typeof EditPostValidation>>({
    resolver: zodResolver(EditPostValidation),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
    },
  });

  async function onSubmit(values: z.infer<typeof EditPostValidation>) {
    console.log(values);
    const newUser = await updateUser({ ...values, userId: user.id });
    if (newUser) navigate(`/profile/${user.id}`);
  }
  return (
    <>
      {isUserLoading ? (
        <Loader />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-dark-4 outline-none border-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-dark-4 outline-none border-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-dark-4 outline-none border-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="bg-dark-4 outline-none border-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary-600"
                disabled={isUserUpdating}
              >
                {`${isUserUpdating ? "Updating..." : "Update Profile"}`}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default ProfileForm;
