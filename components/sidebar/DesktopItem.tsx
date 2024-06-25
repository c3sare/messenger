import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

type DekstopItemProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  asChild?: boolean;
};

const DesktopItem: React.FC<DekstopItemProps> = ({
  children,
  className,
  asChild,
  ...props
}) => {

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn("group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100 [&>svg]:size-6 [&>svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default DesktopItem;
