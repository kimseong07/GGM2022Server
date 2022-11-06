using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class LeaderBoard : MonoBehaviour
{
    public ScrollRect leaderBoard;
    public GameObject textObject;


    // Start is called before the first frame update
    void Start()
    {
        WebsocketClient.GetInstance().playerUpdateAction += UpdateLeaderBoard;
    }

    // Update is called once per frame
    void UpdateLeaderBoard()
    {
        if(WebsocketClient.GetInstance().playerPool.Count > leaderBoard.content.childCount){
            Instantiate(textObject, leaderBoard.content);
        }

        IEnumerator e = leaderBoard.content.transform.GetEnumerator();
        WebsocketClient.GetInstance().playerPool
            .OrderByDescending(i=>i.Value.score)
            .ToList().ForEach(f=>{
                e.MoveNext();
                Transform t = (Transform)e.Current;
                t.gameObject.GetComponent<Text>().text = f +". "+f.Value.nickname + " : "+f.Value.score;
            });

    }
}
