import React from 'react';
import { useForm } from 'lib/useForm';
import { object, string } from 'yup';
import Input from 'components/Common/Form/Input';
import { useCreatePodQuery } from 'components/Pods/service';
import Error from 'components/Common/Error';

const schema = object({
  name: string().required(),
});

export default function NewPage() {
  const form = useForm({
    schema,
  });

  const { createPod, error } = useCreatePodQuery();

  const submit = () => createPod(form.getValues());

  return (
    <div className="flex justify-center pt-10">
      <form onSubmit={form.handleSubmit(submit)}>
        <Error error={error} />
        <Input labelClass="w-24" form={form} name="name" label="Name" />
        <div className="w-full flex justify-end">
          <input className="btn-success" type="submit" value="Create" />
        </div>
      </form>
    </div>
  );
}
