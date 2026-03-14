interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = ({ error, className, ...props }: InputProps) => (
  <div className="w-full">
    <input
      {...props}
      className={`w-full transition-all ${className} 
      ${error ? "border-red-500 ring-1 ring-red-500/50" : ""}`}
    />
    {error && <span className="text-xs text-red-500 mt-1 ml-1 block animate-in fade-in slide-in-from-top-1">{error}</span>}
  </div>
);