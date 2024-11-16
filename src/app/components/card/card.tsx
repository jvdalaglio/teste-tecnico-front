import { SvgIconComponent } from '@mui/icons-material';

type Props = {
  title: string;
  content: string;
  icon: SvgIconComponent; // Tipo correto para ícones do MUI
}

export default function Card({ title, content, icon: Icon }: Props) {
  return (
    <div className="bg-ft-tertiary rounded-lg shadow-md p-4 w-40 h-56 text-2xl flex flex-col justify-center items-center gap-2 text-center">
      <Icon />  {/* Renderizando o ícone como um componente */}
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2">{content}</p>
    </div>
  );
}