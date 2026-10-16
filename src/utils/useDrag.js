"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Pointer Events 기반 드래그 훅.
 * 마우스·터치·펜을 한 경로로 처리하고, 드래그 중에는 window에서 이동을 추적한다.
 *
 * @param {Object} options
 * @param {(event: PointerEvent) => boolean | void} [options.onStart] - false를 반환하면 드래그를 시작하지 않는다.
 * @param {(event: PointerEvent, info: { dx: number, dy: number }) => void} [options.onMove]
 * @param {(event: PointerEvent | null, info: { dx: number, dy: number, cancelled: boolean }) => void} [options.onEnd]
 * @param {boolean} [options.disabled]
 * @param {boolean} [options.preventDefault] - 드래그 시작 시 텍스트 선택 등 기본 동작을 막는다.
 * @param {string} [options.cursor] - 드래그 중 문서 전체에 적용할 커서.
 * @returns {{ dragging: boolean, onPointerDown: (event: React.PointerEvent) => void }}
 */
export const useDrag = ({
  onStart,
  onMove,
  onEnd,
  disabled = false,
  preventDefault = false,
  cursor
} = {}) => {
  const [dragging, setDragging] = useState(false);
  const callbacks = useRef({ onStart, onMove, onEnd });
  callbacks.current = { onStart, onMove, onEnd };
  const session = useRef(null);

  const finish = useCallback((event, cancelled) => {
    const current = session.current;
    if (!current) return;
    session.current = null;
    current.detach();
    setDragging(false);
    const dx = event ? event.clientX - current.startX : current.lastDx;
    const dy = event ? event.clientY - current.startY : current.lastDy;
    callbacks.current.onEnd?.(event, { dx, dy, cancelled });
  }, []);

  const onPointerDown = useCallback(
    (event) => {
      if (disabled || session.current) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (callbacks.current.onStart?.(event) === false) return;
      if (preventDefault) event.preventDefault();

      const pointerId = event.pointerId;
      const target = event.currentTarget;
      try {
        target.setPointerCapture?.(pointerId);
      } catch {
        // 캡처를 지원하지 않는 환경에서도 window 리스너로 추적한다.
      }

      const body = typeof document !== "undefined" ? document.body : null;
      const previousBody = body && {
        cursor: body.style.cursor,
        userSelect: body.style.userSelect
      };
      if (body) {
        if (cursor) body.style.cursor = cursor;
        body.style.userSelect = "none";
      }

      const matches = (e) =>
        e.pointerId === undefined || pointerId === undefined || e.pointerId === pointerId;
      const handleMove = (e) => {
        if (!matches(e) || !session.current) return;
        session.current.lastDx = e.clientX - session.current.startX;
        session.current.lastDy = e.clientY - session.current.startY;
        callbacks.current.onMove?.(e, {
          dx: session.current.lastDx,
          dy: session.current.lastDy
        });
      };
      const handleUp = (e) => {
        if (matches(e)) finish(e, false);
      };
      const handleCancel = (e) => {
        if (matches(e)) finish(e, true);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleCancel);

      session.current = {
        startX: event.clientX,
        startY: event.clientY,
        lastDx: 0,
        lastDy: 0,
        detach: () => {
          window.removeEventListener("pointermove", handleMove);
          window.removeEventListener("pointerup", handleUp);
          window.removeEventListener("pointercancel", handleCancel);
          try {
            if (target.hasPointerCapture?.(pointerId)) {
              target.releasePointerCapture(pointerId);
            }
          } catch {
            // 이미 해제된 캡처는 무시한다.
          }
          if (body && previousBody) {
            body.style.cursor = previousBody.cursor;
            body.style.userSelect = previousBody.userSelect;
          }
        }
      };
      setDragging(true);
    },
    [cursor, disabled, finish, preventDefault]
  );

  // 드래그 중 언마운트되면 리스너와 문서 스타일을 정리한다.
  useEffect(
    () => () => {
      if (session.current) {
        session.current.detach();
        session.current = null;
      }
    },
    []
  );

  // 드래그 중 비활성화되면 취소로 종료한다.
  useEffect(() => {
    if (disabled && session.current) finish(null, true);
  }, [disabled, finish]);

  return { dragging, onPointerDown };
};
