import { render, h } from 'preact';
import Block from './Block';
import './main.css';
import './fittext';

export async function initLookup(block) {
  render(<Block />, block);
}
