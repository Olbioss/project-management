import { createTask } from "@/lib/api";
import { createTaskSchema, Priority, Status } from "@/shared/types";
import type { AnyFieldApi } from "@tanstack/form-core";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import Modal from "../modal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};
export default function ModalNewTask({ isOpen, onClose, id = null }: Props) {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: Status.ToDo as Status,
      priority: Priority.Backlog as Priority,
      tags: "",
      startDate: "",
      dueDate: "",
      projectId: "",
      authorUserId: "",
      assignedUserId: "",
    },
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: createTaskSchema as any,
    },
    onSubmit: async ({ value, formApi }) => {
      const formattedStartDate = formatISO(new Date(value.startDate), {
        representation: "complete",
      });
      const formattedDueDate = formatISO(new Date(value.dueDate), {
        representation: "complete",
      });
      const res = await createTask({
        title: value.title,
        description: value.description,
        status: value.status,
        priority: value.priority,
        tags: value.tags,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        authorUserId: value.authorUserId,
        assignedUserId: value.assignedUserId,
        projectId: id !== null ? Number(id) : Number(value.projectId),
      });
      if (res.success) {
        await queryClient.invalidateQueries({
          queryKey: ["tasks", id],
        });
        form.reset();
        onClose();
        return;
      } else {
        formApi.setErrorMap({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubmit: (res.isFormError ? res.error : "Unexpected error") as any,
        });
      }
      // console.log(
      //   value.title,
      //   value.description,
      //   value.status,
      //   value.priority,
      //   value.tags,
      //   value.startDate,
      //   value.dueDate,
      //   value.authorUserId,
      //   value.assignedUserId,
      //   id
      // );
      // console.log("form...");
    },
  });

  // useEffect(() => {
  //   if (isOpen) {
  //     form.setFieldValue("projectId", id);
  //     if (!form.state.isSubmitting) {
  //       form.reset();
  //     }
  //   }
  // }, [id, isOpen, form]);

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const dateInputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none dark:[color-scheme:dark]";

  return (
    <Modal name="Create New Task" isOpen={isOpen} onClose={onClose}>
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          children={(field) => {
            return (
              <>
                <input
                  id={field.name}
                  className={inputStyles}
                  placeholder="Title"
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
                <input
                  id={field.name}
                  placeholder="Description"
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <form.Field
            name="status"
            children={(field) => {
              return (
                <>
                  <select
                    id="status"
                    className={selectStyles}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value as Status)
                    }
                  >
                    <option value="">Select Status</option>
                    <option value={Status.ToDo}>To Do</option>
                    <option value={Status.WorkInProgress}>
                      Work In Progress
                    </option>
                    <option value={Status.UnderReview}>Under Review</option>
                    <option value={Status.Completed}>Completed</option>
                  </select>
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
          <form.Field
            name="priority"
            children={(field) => {
              return (
                <>
                  <select
                    id="priority"
                    className={selectStyles}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value as Priority)
                    }
                  >
                    <option value="">Select Priority</option>
                    <option value={Priority.Urgent}>Urgent</option>
                    <option value={Priority.High}>High</option>
                    <option value={Priority.Medium}>Medium</option>
                    <option value={Priority.Low}>Low</option>
                    <option value={Priority.Backlog}>Backlog</option>
                  </select>
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <form.Field
          name="tags"
          children={(field) => {
            return (
              <>
                <input
                  id={field.name}
                  placeholder="Tags (separated by comma)"
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <form.Field
            name="startDate"
            children={(field) => {
              return (
                <>
                  <input
                    id={field.name}
                    type="date"
                    className={dateInputStyles}
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
            name="dueDate"
            children={(field) => {
              return (
                <>
                  <input
                    id={field.name}
                    type="date"
                    className={dateInputStyles}
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
        <form.Field
          name="authorUserId"
          children={(field) => {
            return (
              <>
                <input
                  id={field.name}
                  className={inputStyles}
                  placeholder="Author User ID"
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
          name="assignedUserId"
          children={(field) => {
            return (
              <>
                <input
                  id={field.name}
                  className={inputStyles}
                  placeholder="Assigned User ID"
                  name={field.name}
                  value={
                    field.state.value === "" ? undefined : field.state.value
                  }
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            );
          }}
        />
        {id === null && (
          <form.Field
            name="projectId"
            children={(field) => {
              return (
                <>
                  <input
                    id={field.name}
                    className={inputStyles}
                    placeholder="Project ID"
                    name={field.name}
                    value={
                      field.state.value === "" ? undefined : field.state.value
                    }
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        )}
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
      </form>
    </Modal>
  );
}

export function FieldInfo({ field }: { field: AnyFieldApi }) {
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