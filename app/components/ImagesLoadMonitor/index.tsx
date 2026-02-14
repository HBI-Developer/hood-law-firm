import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigation } from "react-router";
import useImagesTracker from "~/hooks/useImagesTracker";
import type { RootState } from "~/store";
import {
  isHiddenOverflow,
  isLoaded,
  isLoading,
  isVisibleOverflow,
} from "~/store/slices/loading";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export default function ImagesLoadMonitor({ className, children }: Props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const location = useLocation();
  const locale = useSelector((state: RootState) => state.language.locale);
  const lastPath = useRef("");
  const overflow = useSelector(
    (state: RootState) => state.loading.hiddenOverflow,
  );
  const { tracker, isLoaded: isImagesLoaded, repeating } = useImagesTracker();

  useEffect(() => {
    if (location) {
      lastPath.current = location.pathname;
    }
  }, []);

  useEffect(() => {
    repeating();
  }, [locale]);

  useEffect(() => {
    if (
      navigation.state === "loading" ||
      (location && location.pathname !== lastPath.current)
    ) {
      dispatch(isLoading());
      dispatch(isHiddenOverflow());
      lastPath.current = location.pathname;
    }

    if (navigation.state === "idle") {
      repeating();
    }
  }, [navigation.state, location.pathname]);

  useEffect(() => {
    if (overflow) {
      document.documentElement.style.overflowY = "hidden";
    } else {
      document.documentElement.style.overflowY = "auto";
    }
  }, [overflow]);

  useEffect(() => {
    if (isImagesLoaded) {
      setTimeout(() => {
        dispatch(isLoaded());
        dispatch(isVisibleOverflow());
      }, 500);
    }
  }, [isImagesLoaded]);

  return (
    <div className={className} ref={tracker}>
      {children}
    </div>
  );
}
