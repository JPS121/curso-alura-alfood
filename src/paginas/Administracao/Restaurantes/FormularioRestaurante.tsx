import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import http from "../../../http"
import IRestaurante from "../../../interfaces/IRestaurante"


const FormularioRestaurante = () => {

  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (params.id) {
      http.get<IRestaurante>(`restaurantes/${params.id}/`)
        .then(resposta => setNomeRestaurante(resposta.data.nome))
    }
  }, [params])

  const [nomeRestaurante, setNomeRestaurante] = useState('')

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (params.id) {
      http.patch(`restaurantes/${params.id}/`, {
        nome: nomeRestaurante
      }).then(() => {
        alert("Restaurante atualizado com sucesso!")
        navigate('/admin/restaurantes')
      })
    } else {
      http.post('restaurantes/', {
        nome: nomeRestaurante
      }).then(() => {
        alert("Restaurante cadastrado com sucesso!")
        navigate('/admin/restaurantes')
      })
    }
  }


  return (

    <Box>
      <Container maxWidth='lg' sx={{ mt: 1 }} >
        <Paper sx={{ p: 2 }}>
          {/* {conteúdo} */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de Restaurantes</Typography>
            <Box component="form" sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
              <TextField
                value={nomeRestaurante}
                onChange={evento => setNomeRestaurante(evento.target.value)}
                label="Nome do restaurante" variant="standard"
                fullWidth
                required
              />
              <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">Salvar</Button>
            </Box>
          </Box >
        </Paper>
      </Container>
    </Box>
  )
}

export default FormularioRestaurante