import { Trash2 } from 'lucide-react'
import { Modal } from './Modal'

interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title?: string
  description?: string
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  loading,
  title = 'Confirmar exclusão',
  description = 'Essa ação não pode ser desfeita. Deseja continuar?',
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="small"
      icon={<Trash2 size={24} />}
      title={title}
      primaryAction={{ label: 'Excluir', onClick: onConfirm, variant: 'danger', loading }}
      secondaryAction={{ label: 'Cancelar', onClick: onClose }}
    >
      {description}
    </Modal>
  )
}
