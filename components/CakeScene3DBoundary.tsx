"use client";

import React from "react";

interface Props {
  onError: (reason?: string) => void;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class CakeScene3DBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError(error.message || "3D rendering error");
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
