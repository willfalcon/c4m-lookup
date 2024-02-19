import { render, h } from 'preact';
import Block from './Block';
import './main.css';

export async function initLookup(block) {
  render(<Block />, block);
}
