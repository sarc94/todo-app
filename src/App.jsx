import React, { useEffect, useState} from 'react';
import {firebase} from './firebase'

function App() {
  const [tareas, setTareas] = useState([])
  const [tarea, setTarea] = useState('')
  const [id, setId] = useState('')
  const [modoEdicion, setModoEdicion] = useState(false)

  // Funcion para Inicializar la Base de datos
  useEffect( () => {
    const obtenerDatos = async () => {
      try {
        const db = firebase.firestore()
        const data = await db.collection("tareas").get()
        const arrayDat = data.docs.map( doc => ({ id: doc.id, ...doc.data() }))
        console.log(arrayDat)
        setTareas(arrayDat)
      } catch (error) {
        console.log('el error:', error)
      }
    }

    obtenerDatos()
  }, [] )

  const agregar = async (e) => { // Funcion para agregar las tareas a la base de datos y al Dom
    e.preventDefault()

    if(!tarea.trim()){
      console.log('La tarea no puede estar vacia')
      return
    } else {
      try {
        const db = firebase.firestore()
        const data = await db.collection('tareas').add({
          nombre: tarea,
          fecha: Date.now()
        })
        const nuevaTarea = {
          nombre: tarea,
          fecha: Date.now()
        }
        setTareas([
          ...tareas,
          {id: data.id, ...nuevaTarea }
        ])
        setTarea('')
      } catch (error) {
        console.log('el error:', error)
      }
    }
  }

  const eliminar = async (id) => { // Funcion para eliminar tareas en la base de datos
    try {
      const db = firebase.firestore()
      if (window.confirm('Seguro desea eliminar la tarea?')) {
        await db.collection('tareas').doc(id).delete()// Metodo db.doc('el id de la instancia').delete() - para borrar
        const arrayFiltrado = tareas.filter(item => item.id !== id)
        setTareas(arrayFiltrado)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const activarEdicion = item => {// funcion que cambia el formulario para editar
    setModoEdicion(!modoEdicion)
    setTarea(item.nombre)
    setId(item.id)
  }

  const editar = async (e) => {
    e.preventDefault()

    if(!tarea.trim()){
      console.log('La tarea no puede estar vacia')
      return
    } else {
      try {
        const db = firebase.firestore()
        await db.collection('tareas').doc(id).update({
          nombre: tarea 
        })
        const arrayEditado = tareas.map(item => (
          item.id === id ? {id: item.id, fecha: item.fecha, nombre: tarea} : item
        ))
        // Edito el arreglo que esta en el DOm
        setTareas(arrayEditado)
        // Limpio los valores de edicion
        setModoEdicion(false)
        setId('')
        setTarea('')
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
            <h3>Lista de Tareas</h3>
            <ul className="list-group">
            {
              tareas.map(item => (
              <li className="list-group-item" key={item.id}>
                <span>{item.nombre}</span>
                  <button 
                    className="btn btn-danger btn-sm float-right"
                    onClick={() => eliminar(item.id)}
                  >
                    Eliminar
                  </button>
                  <button 
                    className="btn btn-warning btn-sm float-right mr-2"
                    onClick= {() => activarEdicion(item)}
                  >
                    Editar
                  </button>
              </li>
              ))
            }
            </ul>
        </div>
        <div className="col-md-6">
          <h3>
          {
            modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'
          }
          </h3>
          <form onSubmit={ modoEdicion ? editar : agregar}>
              <input 
                  type="text" 
                  className="form-control mb-2"
                  placeholder='Ingrese Tarea'
                  value={tarea}
                  onChange={e => setTarea(e.target.value)}
              />
              <button 
                type='submit'
                className={
                  modoEdicion ? 'btn btn-warning btn-block btn-sm' : 
                                'btn btn-dark btn-block btn-sm'
                }
              >
                {
                  modoEdicion ? 'Editar' : 'Agregar'
                }
              </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
