import SnippettBuilder from './snippett_builder/snippett-builder';
import * as templates from '../snippetts/page_layouts';
import * as components from '../snippetts/page_components';
import axios from 'axios';

const snippetView = document.getElementById('snippett-app');

const SnippettBuilderApp = new SnippettBuilder(snippetView);

SnippettBuilderApp.start();
