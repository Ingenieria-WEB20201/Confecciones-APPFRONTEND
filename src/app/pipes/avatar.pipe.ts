import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatar'
})
export class AvatarPipe implements PipeTransform {

  transform(avatar: string): unknown {
    if(avatar === "avatar1"){
      return "../assets/Avatares/Avatar1.png";
    }
    if(avatar === "avatar2"){
      return "../assets/Avatares/Avatar2.png";
    }
    if(avatar === "avatar3"){
      return "../assets/Avatares/Avatar3.png";
    }
    if(avatar === "avatar4"){
      return "../assets/Avatares/Avatar4.png";
    }
    if(avatar === "avatar5"){
      return "../assets/Avatares/Avatar5.png";
    }
    if(avatar === "avatar6"){
      return "../assets/Avatares/Avatar6.png";
    }
    if(avatar === "avatar7"){
      return "../assets/Avatares/Avatar7.png";
    }
    if(avatar === "avatar8"){
      return "../assets/Avatares/Avatar8.png";
    }
    if(avatar === "avatar9"){
      return "../assets/Avatares/Avatar9.png";
    }
    if(avatar === "avatar10"){
      return "../assets/Avatares/Avatar10.png";
    }
    if(avatar === "avatar11"){
      return "../assets/Avatares/Avatar11.png";
    }
    if(avatar === "avatar12"){
      return "../assets/Avatares/Avatar12.png";
    }
  }

}
