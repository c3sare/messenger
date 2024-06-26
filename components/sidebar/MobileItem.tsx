import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

type MobileItemProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  asChild?: boolean;
};

const MobileItem: React.FC<MobileItemProps> = ({
  children,
  asChild,
  className,
  ...props
}) => {

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "group flex gap-x-3 text-sm items-center leading-6 font-semibold w-full justify-center h-[60px] text-gray-500 hover:text-black hover:bg-gray-100 [&>svg]:size-6",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default MobileItem;
