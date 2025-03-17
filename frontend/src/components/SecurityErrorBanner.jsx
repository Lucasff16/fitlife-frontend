import React, { useState, useEffect } from 'react';
import { Alert, AlertTitle, IconButton, Collapse, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

/**
 * Componente para exibir mensagens de erro de segurança
 * @param {Object} props - Propriedades do componente
 * @param {string} props.type - Tipo de erro: 'rate-limit', 'csrf', 'auth', 'general'
 * @param {string} props.message - Mensagem personalizada (opcional)
 * @param {function} props.onClose - Função a ser chamada ao fechar o alerta
 * @param {boolean} props.autoHide - Se o alerta deve desaparecer automaticamente
 * @param {number} props.autoHideTime - Tempo em ms para o alerta desaparecer
 */
const SecurityErrorBanner = ({ 
  type = 'general', 
  message, 
  onClose, 
  autoHide = false, 
  autoHideTime = 5000 
}) => {
  const [open, setOpen] = useState(true);

  // Configurações baseadas no tipo de erro
  const errorConfig = {
    'rate-limit': {
      severity: 'warning',
      title: 'Limite de Requisições Excedido',
      defaultMessage: 'Você fez muitas requisições em um curto período. Por favor, aguarde um momento antes de tentar novamente.',
      icon: <WarningAmberIcon fontSize="inherit" />
    },
    'csrf': {
      severity: 'error',
      title: 'Erro de Validação de Segurança',
      defaultMessage: 'Ocorreu um erro de validação de segurança. A página será recarregada para resolver o problema.',
      icon: <ErrorOutlineIcon fontSize="inherit" />
    },
    'auth': {
      severity: 'error',
      title: 'Erro de Autenticação',
      defaultMessage: 'Sua sessão expirou ou é inválida. Por favor, faça login novamente.',
      icon: <ErrorOutlineIcon fontSize="inherit" />
    },
    'general': {
      severity: 'error',
      title: 'Erro de Segurança',
      defaultMessage: 'Ocorreu um erro de segurança. Por favor, tente novamente ou entre em contato com o suporte.',
      icon: <ErrorOutlineIcon fontSize="inherit" />
    }
  };

  const config = errorConfig[type] || errorConfig.general;
  const displayMessage = message || config.defaultMessage;

  // Auto-hide logic
  useEffect(() => {
    let timer;
    if (autoHide && open) {
      timer = setTimeout(() => {
        setOpen(false);
        if (onClose) onClose();
      }, autoHideTime);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoHide, autoHideTime, open, onClose]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <Collapse in={open}>
        <Alert
          severity={config.severity}
          icon={config.icon}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ 
            mb: 2,
            borderRadius: 0,
            boxShadow: 3,
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center'
            }
          }}
        >
          <AlertTitle>{config.title}</AlertTitle>
          {displayMessage}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default SecurityErrorBanner; 