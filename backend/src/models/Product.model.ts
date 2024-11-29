import { Model } from "sequelize";
import { Platform, Sector, Tag } from "./enum/enum";

export abstract class ProductModel extends Model {
  public id!: string;
  public title!: string;
  public detail!: string;
  public platform!: Platform;
  public imageMain!: string // esta es la imagen de perfil de la app o curso
  public sector!: Sector
  public tags!: Tag[];
  public price!: number;
  public ownerId!: string;
  public aboutLearn!: string; // es el campo "a quien va dirigido" del figma, una descripcion textarea
}
