import type { Status } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "./api";

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: number;
      status: Status;
    }) => updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
