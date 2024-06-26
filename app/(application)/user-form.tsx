import getCurrentUser from "@/actions/getCurrentUser";
import Avatar from "@/components/Avatar"
import SettingsModal from "@/components/sidebar/SettingsModal"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const UserForm = async () => {
    const currentUser = await getCurrentUser();
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className="cursor-pointer hover:opacity-75 transition"
                >
                    <Avatar user={currentUser!} />
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Profile</DialogTitle>
                    <DialogDescription>Edit your public information.</DialogDescription>
                </DialogHeader>
                <SettingsModal currentUser={currentUser!} />
            </DialogContent>
        </Dialog>
    )
}