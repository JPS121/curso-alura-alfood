
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from "@mui/material"
import React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import http from "../../../http"
import IPrato from "../../../interfaces/IPrato"
import IRestaurante from "../../../interfaces/IRestaurante"
import ITag from "../../../interfaces/ITag"


const FormularioPrato = () => {

  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {

    http.get<{ tags: ITag[] }>('tags/').then(resposta => setTags(resposta.data.tags))
    http.get<IRestaurante[]>('restaurantes/').then(resposta => setRestaurantes(resposta.data))

    if (params.id) {
      http.get<IPrato>(`pratos/${params.id}/`)
        .then(resposta => setNomePrato(resposta.data.nome))
    }
  }, [params])

  const [nomePrato, setNomePrato] = useState('')
  const [descricao, setDescricao] = useState('')
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [restaurante, setRestaurante] = useState('')
  const [tags, setTags] = useState<ITag[]>([])
  const [tag, setTag] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)


  const selecionaArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setImagem(event.target.files[0])
    } else {
      setImagem(null)
    }
  }

  const aoSubmeterForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData();

    formData.append('nome', nomePrato)
    formData.append('descricao', descricao)
    formData.append('tag', tag)
    formData.append('restaurante', restaurante)

    if (imagem) {
      formData.append('imagem', imagem)
    }

    http.request({
      url: 'pratos/',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
      .then(() => {
        alert('Prato cadastrado com sucesso')
        navigate('/admin/pratos')
      }).catch(erro => console.log(erro));

  }


  return (

    <Box>
      <Container maxWidth='lg' sx={{ mt: 1 }} >
        <Paper sx={{ p: 2 }}>
          {/* {conteúdo} */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
            <Typography component="h1" variant="h6">Formulário de Pratos</Typography>
            <Box component="form" sx={{ width: '100%' }} onSubmit={aoSubmeterForm}>
              <TextField
                value={nomePrato}
                onChange={evento => setNomePrato(evento.target.value)}
                label="Nome do prato" variant="standard"
                fullWidth
                required
                margin='dense'
              />
              <TextField
                value={descricao}
                onChange={evento => setDescricao(evento.target.value)}
                label="Descrição do prato" variant="standard"
                fullWidth
                required
                margin='dense'
              />
              <FormControl margin="dense" fullWidth >
                <InputLabel id='select-tag'>Tag</InputLabel>
                <Select labelId='select-tag' value={tag} onChange={event => setTag(event.target.value)}>
                  {tags.map(tag =>
                    <MenuItem key={tag.id} value={tag.value} >
                      {tag.value}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <FormControl margin="dense" fullWidth >
                <InputLabel id='select-restaurante'>restaurante</InputLabel>
                <Select labelId='select-restaurante' value={restaurante} onChange={event => setRestaurante(event.target.value)}>
                  {restaurantes.map(restaurante =>
                    <MenuItem key={restaurante.id} value={restaurante.id} >
                      {restaurante.nome}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              <input type="file" onChange={selecionaArquivo} />
              <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">Salvar</Button>
            </Box>
          </Box >
        </Paper>
      </Container>
    </Box>
  )
}

export default FormularioPrato