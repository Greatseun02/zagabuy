"use client"
import {useEffect, useRef, useState} from 'react';
import {usePopper} from 'react-popper';
import type {Boundary, Placement} from '@popperjs/core';

export interface UsePopupOptions {
    placement?: Placement;
    strategy?: 'absolute' | 'fixed';
    offset?: [number, number];
    closeOnOutsideClick?: boolean;
    closeOnEscape?: boolean;
    boundary?: Boundary;
    flipFallbackPlacements?: Placement[];
}

export interface UsePopupReturn {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    toggle: () => void;
    referenceElement: HTMLElement | null;
    setReferenceElement: (el: HTMLElement | null) => void;
    popperElement: HTMLElement | null;
    setPopperElement: (el: HTMLElement | null) => void;
    styles: Record<string, React.CSSProperties>;
    attributes: Record<string, Record<string, string> | undefined>;
    containerRef: React.RefObject<HTMLDivElement | null>;
}

export const usePopup = ({
                             placement = 'bottom-start',
                             strategy = 'absolute',
                             offset = [0, 4],
                             closeOnOutsideClick = true,
                             closeOnEscape = true,
                             boundary = "clippingParents",
                             flipFallbackPlacements = ['top-start', 'top', 'bottom-start', 'bottom']
                         }: UsePopupOptions = {}): UsePopupReturn => {
    const [isOpen, setIsOpen] = useState(false);
    const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
    const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const {styles, attributes} = usePopper(referenceElement, popperElement, {
        placement,
        strategy,
        modifiers: [
            {name: 'offset', options: {offset}},
            {
                name: 'preventOverflow',
                options: {
                    padding: 8,
                    altBoundary: true,
                }
            },
            {
                name: 'flip',
                options: {
                    padding: 8,
                    fallbackPlacements: flipFallbackPlacements,
                    boundary: boundary,
                    altBoundary: true,
                }
            },
            {
                name: 'computeStyles',
                options: {
                    adaptive: true,
                    gpuAcceleration: true,
                }
            },
        ],
    });

    const toggle = () => setIsOpen(o => !o);

    // Close on outside click
    useEffect(() => {
        if (!closeOnOutsideClick || !isOpen) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            const insideContainer = containerRef.current?.contains(target) ?? false;
            const insidePopper = popperElement?.contains(target) ?? false;
            if (!insideContainer && !insidePopper) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, closeOnOutsideClick, popperElement]);

    // Close on ESC
    useEffect(() => {
        if (!closeOnEscape || !isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, closeOnEscape]);

    return {
        isOpen,
        setIsOpen,
        toggle,
        referenceElement,
        setReferenceElement,
        popperElement,
        setPopperElement,
        styles,
        attributes,
        containerRef,
    };
};

export default usePopup;
