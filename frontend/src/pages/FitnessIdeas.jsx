import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Paper, CircularProgress, Box, Divider, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const ResultSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
  borderRadius: '8px',
  whiteSpace: 'pre-line',
}));

const FitnessIdeas = () => {
  const [userPreferences, setUserPreferences] = useState('');
  const [fitnessIdeas, setFitnessIdeas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFitnessIdeas('');

    try {
      // Sempre usar dados simulados devido ao erro de cota da API OpenAI
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular delay
      
      // Personalizar a resposta com base nas preferências do usuário
      let mockResponse = '';
      
      // Verificar se as preferências contêm palavras-chave específicas
      const preferences = userPreferences.toLowerCase();
      
      if (preferences.includes('peito')) {
        mockResponse = `
# Plano de Treino de Peito Personalizado

## Plano de Dieta para Desenvolvimento Muscular
- **Café da manhã**: Omelete de 4 claras com 1 gema, aveia e frutas vermelhas
- **Lanche da manhã**: Whey protein (30g) com água e 1 banana
- **Almoço**: 200g de frango grelhado, 1 xícara de arroz integral e brócolis
- **Lanche da tarde**: Iogurte grego com whey e castanhas
- **Jantar**: 180g de peixe, batata doce e legumes variados
- **Antes de dormir**: Caseína ou cottage com canela

## Rotina de Treinos para Peito
### Segunda-feira: Peito e Tríceps (Foco em Força)
1. Supino reto com barra: 5 séries x 5 repetições (peso máximo)
2. Supino inclinado com halteres: 4 séries x 8 repetições
3. Crucifixo na máquina: 3 séries x 12 repetições
4. Crossover de cabos: 3 séries x 15 repetições
5. Tríceps corda: 4 séries x 10 repetições
6. Tríceps francês: 3 séries x 12 repetições

### Quinta-feira: Peito e Ombros (Foco em Volume)
1. Supino declinado: 4 séries x 10 repetições
2. Flexões com peso: 3 séries até a falha
3. Crucifixo inclinado: 3 séries x 12 repetições
4. Pullover: 3 séries x 15 repetições
5. Desenvolvimento militar: 4 séries x 10 repetições
6. Elevação lateral: 3 séries x 15 repetições

## Dicas Específicas para Desenvolvimento do Peito
- Mantenha a escápula retraída durante os exercícios de peito
- Foque na contração muscular e não apenas no peso
- Varie o ângulo dos exercícios para atingir todas as porções do peitoral
- Descanse pelo menos 48 horas entre treinos de peito
- Consuma 2g de proteína por kg de peso corporal diariamente
- Beba pelo menos 3 litros de água por dia
- Considere suplementação de creatina (5g diários) para aumento de força
`;
      } else if (preferences.includes('perna') || preferences.includes('pernas')) {
        mockResponse = `
# Plano de Treino de Pernas Personalizado

## Plano de Dieta para Desenvolvimento Muscular
- **Café da manhã**: Mingau de aveia com whey protein e frutas
- **Lanche da manhã**: Batata doce com atum
- **Almoço**: 200g de carne vermelha, arroz integral e feijão
- **Lanche da tarde**: Shake proteico com banana e pasta de amendoim
- **Jantar**: 180g de frango, macarrão integral e legumes
- **Antes de dormir**: Iogurte grego com castanhas

## Rotina de Treinos para Pernas
### Segunda-feira: Quadríceps e Glúteos
1. Agachamento livre: 5 séries x 8 repetições
2. Leg press: 4 séries x 10 repetições
3. Cadeira extensora: 3 séries x 12 repetições
4. Avanço com halteres: 3 séries x 12 repetições (cada perna)
5. Elevação pélvica: 4 séries x 15 repetições
6. Agachamento sumô: 3 séries x 15 repetições

### Quinta-feira: Posterior de Coxa e Panturrilha
1. Stiff: 4 séries x 10 repetições
2. Mesa flexora: 4 séries x 12 repetições
3. Cadeira adutora: 3 séries x 15 repetições
4. Cadeira abdutora: 3 séries x 15 repetições
5. Panturrilha em pé: 5 séries x 20 repetições
6. Panturrilha sentado: 4 séries x 15 repetições

## Dicas Específicas para Desenvolvimento das Pernas
- Treine com amplitude completa de movimento
- Mantenha os joelhos alinhados com os pés durante agachamentos
- Inclua exercícios unilaterais para corrigir desequilíbrios
- Priorize o descanso adequado (48-72h) entre treinos de pernas
- Consuma carboidratos complexos antes do treino de pernas
- Aumente gradualmente a carga para estimular hipertrofia
- Não negligencie o treino de panturrilha para um desenvolvimento proporcional
`;
      } else {
        mockResponse = `
# Plano Fitness Personalizado

## Plano de Dieta
- **Café da manhã**: Omelete de claras com vegetais e uma fatia de pão integral
- **Lanche da manhã**: 1 maçã e 20g de castanhas
- **Almoço**: 150g de frango grelhado, 1 xícara de arroz integral e salada verde
- **Lanche da tarde**: Shake proteico com frutas vermelhas
- **Jantar**: 150g de peixe, legumes assados e 1/2 batata doce

## Rotina de Treinos
### Segunda-feira: Peito e Tríceps
1. Supino reto: 4 séries x 10 repetições
2. Crucifixo: 3 séries x 12 repetições
3. Tríceps corda: 4 séries x 12 repetições

### Terça-feira: Pernas
1. Agachamento: 4 séries x 10 repetições
2. Leg press: 3 séries x 12 repetições
3. Cadeira extensora: 3 séries x 15 repetições

### Quarta-feira: Descanso ativo (30 min de caminhada)

### Quinta-feira: Costas e Bíceps
1. Puxada frontal: 4 séries x 10 repetições
2. Remada curvada: 3 séries x 12 repetições
3. Rosca direta: 3 séries x 12 repetições

## Dicas Adicionais
- Beba pelo menos 3 litros de água por dia
- Durma 7-8 horas por noite
- Faça alongamentos todos os dias
- Considere suplementação de whey protein após os treinos
`;
      }
      
      setFitnessIdeas(mockResponse);
    } catch (err) {
      console.error('Erro ao gerar ideias fitness:', err);
      setError('Ocorreu um erro ao gerar as ideias fitness. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar o texto com markdown básico
  const formatText = (text) => {
    if (!text) return null;
    
    // Dividir por linhas
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Títulos
      if (line.startsWith('# ')) {
        return <Typography key={index} variant="h4" gutterBottom>{line.substring(2)}</Typography>;
      }
      if (line.startsWith('## ')) {
        return <Typography key={index} variant="h5" gutterBottom sx={{ mt: 2 }}>{line.substring(3)}</Typography>;
      }
      if (line.startsWith('### ')) {
        return <Typography key={index} variant="h6" gutterBottom sx={{ mt: 1.5 }}>{line.substring(4)}</Typography>;
      }
      
      // Listas
      if (line.startsWith('- ')) {
        return (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
            <Typography>{line.substring(2)}</Typography>
          </Box>
        );
      }
      
      // Listas numeradas
      if (/^\d+\.\s/.test(line)) {
        const number = line.match(/^\d+/)[0];
        return (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
            <Typography sx={{ minWidth: 24, fontWeight: 'bold', color: 'primary.main' }}>{number}.</Typography>
            <Typography>{line.substring(number.length + 2)}</Typography>
          </Box>
        );
      }
      
      // Linha em branco
      if (line.trim() === '') {
        return <Box key={index} sx={{ height: 12 }} />;
      }
      
      // Texto normal
      return <Typography key={index} paragraph={false} sx={{ my: 0.5 }}>{line}</Typography>;
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mt: 4 }}>
        Gerador de Ideias Fitness
      </Typography>
      
      <Typography variant="body1" align="center" paragraph>
        Descreva suas preferências, objetivos e restrições para receber um plano personalizado de dieta e treinos.
      </Typography>
      
      <StyledPaper elevation={3}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Suas preferências fitness"
            placeholder="Ex: dieta low-carb, treinos intensos 4 vezes por semana, foco em hipertrofia, intolerância a lactose..."
            multiline
            rows={4}
            fullWidth
            value={userPreferences}
            onChange={(e) => setUserPreferences(e.target.value)}
            variant="outlined"
            required
          />
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={loading || !userPreferences.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <TipsAndUpdatesIcon />}
            >
              {loading ? 'Gerando ideias...' : 'Gerar Plano Personalizado'}
            </Button>
          </Box>
        </form>
        
        {error && (
          <Box sx={{ mt: 3, p: 2, bgcolor: '#ffebee', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        
        {fitnessIdeas && (
          <Box sx={{ mt: 4 }}>
            <Divider>
              <Chip icon={<FitnessCenterIcon />} label="Seu Plano Personalizado" />
            </Divider>
            
            <ResultSection>
              {formatText(fitnessIdeas)}
            </ResultSection>
          </Box>
        )}
      </StyledPaper>
    </Container>
  );
};

export default FitnessIdeas; 