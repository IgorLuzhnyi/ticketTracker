import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";

type FormValues = {
  cart: {
    name: string;
    amount: number;
  }[];
};

let renderCount = 0;

function getTotal(payload: FormValues["cart"]) {
  let total = 0;

  for (const item of payload) {
    total = total + (Number.isNaN(item.amount) ? 0 : item.amount);
  }

  return total;
}

function TotalAmout({ control }: { control: Control<FormValues> }) {
  const cartValues = useWatch({
    control,
    name: "cart",
  });

  return <p>{getTotal(cartValues)}</p>;
}

export default function TestComponent() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      cart: [{ name: "", amount: 0 }],
    },
  });
  const { fields, append, prepend, remove } = useFieldArray({
    name: "cart",
    control,
    rules: {
      required: "Please append at least 1 item",
    },
  });
  renderCount++;

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          console.log("Submit data", data);
        })}
      >
        {fields.map((field, index) => {
          return (
            <section key={field.id}>
              <label>
                <span>Name</span>
                <input
                  {...register(`cart.${index}.name`, { required: true })}
                />
              </label>
              <label>
                <span>amount</span>
                <input
                  type="number"
                  {...register(`cart.${index}.amount`, { valueAsNumber: true })}
                />
              </label>
              <button type="button" onClick={() => remove(index)}>
                Delete
              </button>
            </section>
          );
        })}
        <button
          type="button"
          onClick={() => {
            append({
              name: "append",
              amount: 0,
            });
          }}
        >
          Append
        </button>
        <button
          type="button"
          onClick={() => {
            prepend({
              name: "prepend",
              amount: 0,
            });
          }}
        >
          prepend
        </button>

        <TotalAmout control={control} />

        <p>{errors.cart?.root?.message}</p>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
