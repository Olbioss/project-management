import Modal from "@/components/modal";
import { createProject } from "@/lib/api";
import { createProjectSchema } from "@/shared/types";
import type { AnyFieldApi } from "@tanstack/form-core";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";
// import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
    },
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: createProjectSchema as any,
    },
    onSubmit: async ({ value, formApi }) => {
      const formattedStartDate = formatISO(new Date(value.startDate), {
        representation: "complete",
      });
      const formattedEndDate = formatISO(new Date(value.endDate), {
        representation: "complete",
      });
      const res = await createProject(
        value.name,
        value.description,
        formattedStartDate,
        formattedEndDate
      );
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["projects"] });
        return;
      } else {
        formApi.setErrorMap({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit: (res.isFormError ? res.error : "Unexpected error") as any,
        });
      }
    },
  });

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none dark:[color-scheme:dark]";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="name"
          children={(field) => {
            return (
              <>
                <input
                  id={field.name}
                  className={inputStyles}
                  placeholder="Project Name"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            );
          }}
        />
        <form.Field
          name="description"
          children={(field) => {
            return (
              <>
                <textarea
                  id={field.name}
                  className={inputStyles}
                  name={field.name}
                  placeholder="Description"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            );
          }}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <form.Field
            name="startDate"
            children={(field) => {
              return (
                <>
                  <input
                    id={field.name}
                    type="date"
                    className={inputStyles}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
          <form.Field
            name="endDate"
            children={(field) => {
              return (
                <>
                  <input
                    type="date"
                    id={field.name}
                    className={inputStyles}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.errorMap]}
          children={([errorMap]) =>
            errorMap.onSubmit ? (
              <p className="text-[0.8rem] font-medium text-destructive">
                {String(errorMap.onSubmit)}
              </p>
            ) : null
          }
        />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button
              className="focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? "..." : "Submit"}
            </button>
          )}
        />
        {/* <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button> */}
      </form>
    </Modal>
  );
};

export default ModalNewProject;

// function FieldInfo({ field }: { field: AnyFieldApi }) {
//   return (
//     <>
//       {field.state.meta.isTouched && !field.state.meta.isValid ? (
//         <em>{field.state.meta.errors.join(", ")}</em>
//       ) : null}
//       {field.state.meta.isValidating ? "Validating..." : null}
//     </>
//   );
// }
function FieldInfo({ field }: { field: AnyFieldApi }) {
  const { errors, isTouched } = field.state.meta;

  if (!isTouched || !errors.length) return null;

  const messages = errors.map((err: unknown) =>
    typeof err === "string"
      ? err
      : (err as { message?: string }).message ?? JSON.stringify(err)
  );

  return (
    <p className="text-[0.8rem] font-medium text-red-500">
      {messages.join(", ")}
    </p>
  );
}
