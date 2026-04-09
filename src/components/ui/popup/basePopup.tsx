import React, {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';

export type BasePopupProps = {
    referenceElement: HTMLElement | null;
    isOpen: boolean;
    onClose?: () => void;
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'bottom-end';
    children: React.ReactNode;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const BasePopup: React.FC<BasePopupProps> = ({
                                                 referenceElement,
                                                 children,
                                                 isOpen,
                                                 onClose,
                                                 placement = 'bottom-end',
                                                 ...props
                                             }) => {
    const popperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen || !referenceElement || !popperRef.current) return;

        const updatePosition = () => {
            if (!referenceElement || !popperRef.current) return;

            const refRect = referenceElement.getBoundingClientRect();
            const popperRect = popperRef.current.getBoundingClientRect();

            let top, left;

            switch (placement) {
                case 'bottom-end':
                    top = refRect.bottom + window.scrollY;
                    left = refRect.right - popperRect.width + window.scrollX;
                    break;
                // Add other cases as needed
                default:
                    top = refRect.bottom + window.scrollY;
                    left = refRect.left + window.scrollX;
            }

            popperRef.current.style.top = `${top}px`;
            popperRef.current.style.left = `${left}px`;
        };

        updatePosition();

        window.addEventListener('scroll', updatePosition);
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, referenceElement, placement]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popperRef.current && !popperRef.current.contains(event.target as Node) &&
                referenceElement && !referenceElement.contains(event.target as Node)) {
                onClose && onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, referenceElement]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={popperRef}
            {...props}
            style={{
                position: 'absolute',
                zIndex: 9999,
                ...props.style
            }}
        >
            {children}
        </div>,
        document.body
    );
};

export default BasePopup;
