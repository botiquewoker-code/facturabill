"use client";

import { useEffect, useLayoutEffect } from "react";

export const useClientLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;
