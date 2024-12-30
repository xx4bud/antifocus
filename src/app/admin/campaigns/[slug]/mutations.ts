import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitCampaign } from "./actions";

export function useSubmitCampaign() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: submitCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["campaigns"],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return mutation;
}
