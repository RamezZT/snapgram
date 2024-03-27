import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type props = {
  title: string;
  description?: string;
  children?: ReactNode;
  onClick?: () => void;
};

const EnsuringModal = ({ title, description, children, onClick }: props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-sm:w-[20rem] border-rose-800">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description} </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button
            autoFocus={false}
            onClick={onClick}
            className="bg-rose-800 outline-none"
          >
            Confirm
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default EnsuringModal;
