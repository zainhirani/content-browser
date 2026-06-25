const Spinner = ({ label = "Loading" }: { label?: string }) => {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-brand"
    />
  );
}

export default Spinner;