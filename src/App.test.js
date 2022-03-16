import React from "react";
import App, { Todo, TodoForm, useTodos } from "./App";
// mount permite acceder a los componentes hijos (pruebas de integración)
import { shallow, mount } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// Configuración que sirve para correr tests sobre los componentes
Enzyme.configure({ adapter: new Adapter() });

describe("App", () => {
  describe("Todo", () => {
    it('Se ejecuta completeTodo cuando se clickea botón "Complete"', () => {
      // Se crea mock de la función completeTodo
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      // Obtener la cantidad de veces que se llamó la función completeTodo y con qué argumentos
      // completeTodo.mock.calls === [[5], [1,6], [2,7,4], [8,2]]
      const index = 5;
      const todo = {
        isCompleted: true,
        text: 'lala'
      };
      // Renderizado del componente
      const wrapper = shallow(<Todo
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        index={index}
        todo={todo}
      />)
      // Método find devuelve elementos del dom
      // at(0) especifica el elemento que hace referencia, cuando hay más de uno (como un array)
      wrapper
        .find('button')
        // Primer botón en el dom
        .at(0)
        .simulate('click');

      // Expect es una función que permite generar aserciones (lanzar error en caso de que no se cumpla) 
      // --> expect(received).toEqual(expected)
      // toEquals compara dos elementos
        expect(completeTodo.mock.calls).toEqual([[5]])
        // Se comprueba de que cuando se clickea 'Complete' no se ejecute removeTodo
        expect(removeTodo.mock.calls).toEqual([]);
    })

    it('Se ejecuta removeTodo cuando se clickea botón "X"', () => {
      // Se crea mock de la función completeTodo
      const completeTodo = jest.fn();
      const removeTodo = jest.fn();
      // Obtener la cantidad de veces que se llamó la función completeTodo y con qué argumentos
      // completeTodo.mock.calls === [[5], [1,6], [2,7,4], [8,2]]
      const index = 5;
      const todo = {
        isCompleted: true,
        text: 'lala'
      };
      // Renderizado del componente
      const wrapper = shallow(<Todo
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        index={index}
        todo={todo}
      />)
      // Método find devuelve elementos del dom
      // at(0) especifica el elemento que hace referencia, cuando hay más de uno (como un array)
      wrapper
        .find('button')
        // segundo botón
        .at(1)
        .simulate('click');
      // Expect es una función que permite generar aserciones (lanzar error en caso de que no se cumpla)
      // toEquals compara dos elementos
        expect(removeTodo.mock.calls).toEqual([[5]]);
        expect(completeTodo.mock.calls).toEqual([]);

    });
  });

  describe('TodoForm', () => {
    it('Llamar a addTodo cuando el formulario tiene un valor', () => {
      const addTodo = jest.fn();
      const prevent = jest.fn();
      const wrapper = shallow(
        <TodoForm
          addTodo={addTodo}
        />
      )
      wrapper
        .find('input')
        // al método simulate le paso el evento que quiero simular y el objeto que debe llevar la función (e.target.value)
        .simulate('change', { target: { value: 'Mi nuevo todo'}});
      wrapper
      .find('form')
      .simulate('submit', { preventDefault: prevent});

      expect(addTodo.mock.calls).toEqual([[ 'Mi nuevo todo' ]]);
      expect(prevent.mock.calls).toEqual([[]]);
    })
  });

  describe('Custom hook useTodos', () => {
    it('addTodo', () => {
      // Definir un componente de prueba para poder ejecutar el hook
      const Test = (props) => {
        const hook = props.hook();
        // Destructuring de hook en el elemento html
        return <div {...hook}></div>
      }
      const wrapper = shallow(<Test hook={useTodos}/>)
      // Obtener las props del div(valor inicial)
      let props = wrapper.find('div').props();
      // Llamar a addTodo
      props.addTodo('Texto de prueba');
      // Volver a solicitar las props (valor final luego de llamar la función addTodo)
      props = wrapper.find('div').props();
      console.log('props', props);
      expect(props.todos[0]).toEqual({text: 'Texto de prueba'});
    })

    it('completeTodo', () => {
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook}></div>
      }
      const wrapper = shallow(<Test hook={useTodos}/>)
      let props = wrapper.find('div').props();
      props.completeTodo(0);
      props = wrapper.find('div').props();
      console.log('props', props);
      expect(props.todos[0]).toEqual({text: 'Todo 1', isCompleted : true});
    });

    it('removeTodo', () => {
      const Test = (props) => {
        const hook = props.hook();
        return <div {...hook}></div>
      }
      const wrapper = shallow(<Test hook={useTodos}/>)
      let props = wrapper.find('div').props();
      props.removeTodo(0);
      props = wrapper.find('div').props();
      console.log('props', props);
      expect(props.todos).toEqual(
        [ 
          {
            text: "Todo 2",
            isCompleted: false
          },
          {
            text: "Todo 3",
            isCompleted: false
          }
        ]
      )
    });

    // Test de integración de App.js
    it('App', () => {
      const wrapper = mount(<App/>);
      const prevent = jest.fn();
      wrapper
        .find('input')
        .simulate('change', { target: { value: 'Mi todo' } });
      wrapper
        .find('form')
        // En este punto se ejecuta la función addTodo
        .simulate('submit', { preventDefault: prevent })
      const respuesta = wrapper
        // Buscando todos los componentes del dom que tengan la clase 'todo
        .find('.todo')
        // Primer elemento
        .at(0)
        // Transforma el elementp en texto
        .text()
        // Retorna un boolean
        .includes('Mi todo')
        console.log('respuesta', respuesta);
        expect(respuesta).toEqual(true);
        // Probar que prevent haya sido llamado
        expect(prevent.mock.calls).toEqual([[]]);
    })
  })
});
