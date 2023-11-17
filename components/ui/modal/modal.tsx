import styles from "./modal.module.css";

export default function Modal({ width, height, visible, closable, children, expandingModal = false, onClose, style }: { width: number|string, height: number|string, visible: boolean, closable: boolean, expandingModal?: boolean, children: React.ReactNode, onClose?: () => void, style?: React.CSSProperties }) {
    if (visible) {
        return (
            <>
                <section className={`${styles.modal} ${expandingModal && styles.expandingModal} dark:bg-black`} style={{ width: width, height: height, ...style }}>
                    {closable && <div className={styles.closeBtn} onClick={onClose}>x</div>}
                    {children}
                </section>
                <div className={styles.overlay} onClick={closable ? onClose : () => {}}></div>
            </>
        );
    } else {
        return null;
    }

}