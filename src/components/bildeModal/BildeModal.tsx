import * as React from "react";
import classnames from "classnames";
import Modal from "react-modal";
import {Props} from "react-modal";
import Lukknapp from "nav-frontend-lukknapp";
import "nav-frontend-modal-style";
// const cls = (className: string) => classnames('modal', className);

/**
 * Modalen bruker `react-modal`, se [github siden](https://github.com/reactjs/react-modal) for mer informasjon.
 *
 */

export interface ModalProps extends Props {
    /**
     * Bestemmer om modalen skal være synlig
     */
    isOpen: boolean;
    /**
     * En beskrivelse av formålet med modalen, blir satt som `aria-label`
     */
    contentLabel: string;
    /**
     * Innholdet i modalen
     */
    children: React.ReactNode;
    /**
     * Funksjon som blir kalt i det modalen ønsker å lukkes
     */
    onRequestClose: () => void;
    /**
     * Bestemmer om modalen selv skal legge til en lukkeknapp
     */
    closeButton?: boolean;
    /**
     * Funksjon som blir kalt når modalen har blitt åpnet. Kan brukes for å sette fokus på ett element
     */
    onAfterOpen?: () => void;
    /**
     * Om klikk på overlay skal lukke modalen
     */
    shouldCloseOnOverlayClick?: boolean;
    /**
     * Tall som beskriver hvor lenge modalen venter før den lukkes
     */
    closeTimeoutMS?: number;
    /**
     * Klasse for content-taggen
     */
    contentClass?: string;
    /**
     * Klasse som legges til dialog
     */
    className?: string;
}

class BildeModal extends React.Component<ModalProps, {}> {
    closeButtonRef: any; // Lukknapp | null;
    // modalRef: Modal | null;
    //
    // static setAppElement(element: any) {
    //     Modal.setAppElement(element);
    // }

    static defaultProps = {
        closeButton: true,
        shouldCloseOnOverlayClick: true,
        closeTimeoutMS: 0,
        contentClass: undefined,
        onAfterOpen: undefined,
    };

    constructor(props: ModalProps) {
        super(props);
        this.onRequestClose = this.onRequestClose.bind(this);
    }

    onRequestClose(evt: any): void {
        const {onRequestClose, shouldCloseOnOverlayClick} = this.props;
        if (shouldCloseOnOverlayClick || evt.type === "keydown") {
            onRequestClose();
        } else if (this.closeButtonRef) {
            this.closeButtonRef.focus();
        }
        // else {
        //     if (this.modalRef && (this.modalRef as any).portal && (this.modalRef as any).portal.refs.content) {
        //         (this.modalRef as any).portal.refs.content.focus();
        //     }
        // }
    }

    render() {
        const {children, closeButton, shouldCloseOnOverlayClick, contentClass, ...props} = this.props;

        const lukkModalLabel = "Lukk modal";

        const appElement: HTMLElement | null = document.getElementById("root");

        return (
            <Modal
                {...props}
                // className={cls(props.className)}
                className={props.className}
                onRequestClose={this.onRequestClose}
                overlayClassName="modal__overlay"
                shouldCloseOnOverlayClick
                appElement={appElement !== null ? appElement : {}}
                // ref={(modalRef: any) => {
                //     this.modalRef = modalRef;
                // }}
            >
                <section className={contentClass}>{children}</section>
                {closeButton && (
                    <Lukknapp
                        overstHjorne={true}
                        className={classnames({
                            "modal__lukkknapp--shake": shouldCloseOnOverlayClick,
                        })}
                        ariaLabel={lukkModalLabel}
                        onClick={props.onRequestClose}
                        ref={(closeButtonRef) => {
                            this.closeButtonRef = closeButtonRef;
                        }}
                    >
                        {lukkModalLabel}
                    </Lukknapp>
                )}
            </Modal>
        );
    }
}

export default BildeModal;
