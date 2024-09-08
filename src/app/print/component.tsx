'use client';;
function Template({ template, data }: { template: string, data: any }) {
  
}

export default function Print(props: { template: string, data: any } & any) {
  if (props.template === 'application') {
    return (
      <div>
        Length: {Object.keys(props.data).length}
        {Object.entries(props.data).map(([key, value]) => (
          <div key={key}>{key} - {value?.toString()}</div>
        ))}
      </div>
    )
  }
}