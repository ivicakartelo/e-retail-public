import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import { DepartmentsList } from './features/departments/DepartmentsList';
import { CategoriesList } from './features/categories/CategoriesList';
import { ArticlesList } from './features/articles/ArticlesList';
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom"
import {Provider} from 'react-redux'
import store from './app/store'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} >
                    <Route
                        index
                        element={<ArticlesList />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
)