import React, { ComponentProps } from "react";
import { cn } from "@/lib/utils"

export const RootLayout = ({ className, children, ...props }: ComponentProps<'main'>): React.ReactElement => {
  return <main className={cn('h-screen w-full', className)} {...props}>{children}</main>
}
