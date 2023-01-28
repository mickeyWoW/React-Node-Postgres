import React from 'react';
import { useForm } from 'lib/useForm';
import { object, string, number as yupNumber, date, array, ref } from 'yup';
import Input from 'components/Common/Form/Input';
import { usePodsQuery } from 'components/Pods/service';
import Error from 'components/Common/Error';
import { useSkills } from 'components/Skills/service';
import Spinner from 'components/Common/Spinner';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import ErrorMessage from 'components/Common/Form/ErrorMessage';
import { Controller } from 'react-hook-form';
import { useCreateWorkOrderQuery } from 'components/WorkOrders/service';

const number = () => yupNumber().typeError('${path} must be a number');

const schema = object({
  name: string().label('Name').required(),
  productSku: string().label('Product SKU').required(),
  pod: object({
    value: number().label('Pod').required(),
  }).required(),
  totalQuantity: number().label('Total Quantity').required(),
  endDate: date().label('End Date').required(),
  paymentTerms: number().label('Payment / Per Item').required(),
  minTaskQuantity: number().label('Min Maker Qty').required(),
  maxTaskQuantity: number()
    .label('Max Maker Qty')
    .min(ref('minTaskQuantity'))
    .required(),
  timeEstimateMin: number().label('Est Time Min').required(),
  timeEstimateMax: number().label('Est Time Max').required(),
  instructionsPdfLink: string().label('PDF instructions link').required(),
  instructionsVideoLink: string().label('Video instructions link').required(),
  postSignupInstructions: string().label('Post Signup Instructions').required(),
  skills: array().of(number().required()),
});

export default function NewPage() {
  const { data: skills, isLoading: isLoadingSkills } = useSkills();
  const { data: pods } = usePodsQuery();

  const form = useForm({
    schema,
  });

  const { createWorkOrder, error } = useCreateWorkOrderQuery();

  const submit = () => {
    const { pod, skills = [], ...values } = form.getValues();
    createWorkOrder({
      ...values,
      skills: skills,
      podId: pod.value,
      paymentStatus: 'payment status',
      completedQuantity: 0,
    });
  };

  return (
    <div className="flex justify-center pb-10">
      <form onSubmit={form.handleSubmit(submit)}>
        <h1 className="text-2xl text-center mt-2 mb-8">
          Create New Work Order
        </h1>
        <Error error={error} />
        <div className="flex">
          <div className="mr-24">
            <div className="text-xl mb-5">Choose Skills</div>
            {isLoadingSkills && <Spinner />}
            <div className="pl-5">
              {skills?.map((skill) => (
                <label key={skill.id} className="flex items-center mb-4">
                  <input
                    ref={form.register}
                    name="skills[]"
                    value={skill.id}
                    type="checkbox"
                    className="checkbox mr-2"
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <Input
              labelClass="w-40"
              form={form}
              name="name"
              label="Task Name"
            />
            <Input
              labelClass="w-40"
              form={form}
              name="productSku"
              label="Product SKU"
            />
            <label className="block mb-5">
              <div className="flex items-center">
                <div className="w-40 flex-shrink-0">Pod</div>
                <Controller
                  name="pod"
                  control={form.control}
                  render={(props) => {
                    return (
                      <Select
                        {...props}
                        className="react-select w-full"
                        options={pods?.map((pod) => ({
                          value: pod.id,
                          label: pod.name,
                        }))}
                      />
                    );
                  }}
                />
              </div>
              <ErrorMessage addClass="text-right" form={form} name="pod.id" />
            </label>
            <Input
              labelClass="w-40"
              form={form}
              name="totalQuantity"
              label="Total Quantity"
              type="number"
            />
            <label className="block mb-5">
              <div className="flex items-center">
                <div className="w-40 flex-shrink-0">End Date</div>
                <Controller
                  name="endDate"
                  control={form.control}
                  render={({ value, onBlur, onChange }) => (
                    <DatePicker
                      className="input"
                      selected={value}
                      onBlur={onBlur}
                      onChange={onChange}
                    />
                  )}
                />
              </div>
              <ErrorMessage addClass="text-right" form={form} name="endDate" />
            </label>
            <label className="block mb-5">
              <div className="flex items-center">
                <div className="w-40 flex-shrink-0">Payment / Per Item</div>
                <div className="w-56 flex items-center">
                  <div className="mr-2">$</div>
                  <input
                    ref={form.register}
                    name="paymentTerms"
                    type="number"
                    className="input w-full"
                  />
                </div>
              </div>
              <ErrorMessage addClass="text-right" form={form} name="endDate" />
            </label>
            <Input
              labelClass="w-40"
              form={form}
              name="minTaskQuantity"
              label="Min Maker Qty"
            />
            <Input
              labelClass="w-40"
              form={form}
              name="maxTaskQuantity"
              label="Max Maker Qty"
            />
            <label className="block mb-5">
              <div className="flex items-center">
                <div className="w-40 flex-shrink-0">Est Time Min</div>
                <div className="flex items-center w-56">
                  <input
                    ref={form.register}
                    type="number"
                    name="timeEstimateMin"
                    className="input w-full mr-2"
                  />
                  minutes
                </div>
              </div>
              <ErrorMessage
                addClass="text-right"
                form={form}
                name="timeEstimateMin"
              />
            </label>
            <label className="block mb-5">
              <div className="flex items-center">
                <div className="w-40 flex-shrink-0">Est Time Max</div>
                <div className="flex items-center w-56">
                  <input
                    ref={form.register}
                    type="number"
                    name="timeEstimateMax"
                    className="input w-full mr-2"
                  />
                  minutes
                </div>
              </div>
              <ErrorMessage
                addClass="text-right"
                form={form}
                name="timeEstimateMax"
              />
            </label>
            <Input
              labelClass="w-40"
              form={form}
              name="instructionsPdfLink"
              label="PDF instructions"
            />
            <Input
              labelClass="w-40"
              form={form}
              name="instructionsVideoLink"
              label="Video instructions"
            />
            <label className="block mb-5">
              <div className="mb-2">Post Signup Instructions</div>
              <textarea
                ref={form.register}
                className="w-full input h-auto"
                name="postSignupInstructions"
                rows={5}
              />
              <ErrorMessage
                addClass="text-right"
                form={form}
                name="postSignupInstructions"
              />
            </label>
          </div>
        </div>
        <div className="w-full flex justify-end">
          <input className="btn-success" type="submit" value="Create" />
        </div>
      </form>
    </div>
  );
}
