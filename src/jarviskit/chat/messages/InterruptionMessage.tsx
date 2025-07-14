export function InterruptionMessage(props: { message: string }) {
  return <div className="flex justify-start">
    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg w-full min-h-[250px] border border-red-500">
      {props.message}
    </div>
  </div>
}