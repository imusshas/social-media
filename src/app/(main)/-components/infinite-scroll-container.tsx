import { useInView } from "react-intersection-observer";

type InfiniteScrollContainerProps = {
  onBottomReach: () => void;
  className?: string;
} & React.PropsWithChildren;

export function InfiniteScrollContainer({
  onBottomReach,
  className,
  children,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) onBottomReach();
    },
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}
