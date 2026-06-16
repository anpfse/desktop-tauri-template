import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Unhandled React error", error, info);
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
          <div className="w-full max-w-md space-y-4 rounded-md border p-5">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold">页面出现异常</h1>
              <p className="text-sm text-muted-foreground">
                {this.state.error.message || "未知错误"}
              </p>
            </div>
            <Button onClick={this.reset}>重试</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
