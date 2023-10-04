import { Button, MenuItem, Select, TextField } from '@mui/material';
import axios, { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';
import { IPaginacao } from '../../interfaces/IPaginacao';
import IRestaurante from '../../interfaces/IRestaurante';
import { IParametrosBusca } from '../../interfaces/IParametrosBusca';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
const ListaRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {
    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setProximaPagina(resposta.data.next)
        setPaginaAnterior(resposta.data.previous)
      })
      .catch()
  }


  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/')
  }, [])

  const submeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const opcoes = {
      params: {

      } as IParametrosBusca
    }
    if (busca) {
      opcoes.params.search = busca
    } if (ordenacao) {
      opcoes.params.ordering = ordenacao
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes)
  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    <form onSubmit={submeterForm}>
      <TextField placeholder='Nome Restaurante' type="text" value={busca} onChange={evento => setBusca(evento.target.value)}></TextField>
      <Select
        name="select-ordenacao"
        id="select-ordenacao"
        value="ordenacao"
        onChange={evento => setOrdenacao(evento.target.value)}
      >
        <MenuItem value="">Padrão</MenuItem>
        <MenuItem value="id">Id</MenuItem>
        <MenuItem value="nome">Nome</MenuItem>
      </Select>

      <Button type="submit" >procurar</Button>
    </form >
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {
      <button onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
        Página Anterior
      </button>
    }
    {
      <button onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
        Próxima página
      </button>
    }

  </section >)
}

export default ListaRestaurantes