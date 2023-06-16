import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/main";

export const trpc = createTRPCReact<AppRouter>();
