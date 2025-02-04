import React, { useState, useEffect, useRef } from 'react'

const Modal = ({owner,show,setShow}) => {
    const modalRef = useRef(null);
    const [modalInstance, setModalInstance] = useState(null);

    useEffect(() => {
        if (modalRef.current) {
            const modal = new window.bootstrap.Modal(modalRef.current,{ backdrop: 'static'});
            setModalInstance(modal);
        }
    }, []);

    useEffect(() => {
        if (show && modalInstance) {
            modalInstance.show();
        } else if (!show && modalInstance) {
            modalInstance.hide();
        }
    }, [show, modalInstance]);

    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
          <div className="modal" ref={modalRef} tabindex="-1">
            <div className="modal-dialog">
                <div className="modal-content mt-5">
                    <div className="modal-header">
                        <h5 className="modal-title">Owner Information</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <p className='mb-0'><strong>Name:</strong> {owner.name}</p>
                        <p className='mb-0'><strong>Phone:</strong> +91 {owner.phone}</p>
                        <p className='mb-0'><strong>Email:</strong> {owner.email}</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Modal